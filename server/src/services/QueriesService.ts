import { Service } from "typedi";
import _ from "lodash";
import Queries from "../entities/Queries";
import Topic from "../entities/Topic";
import NotFound, { BadRequest } from "../utils/errorCode";
import Answer from "../entities/Answer";

@Service()
class QueriesService {
  async destroy(queryId: number) {
    const query = await Queries.findOne({
      where: {
        id: queryId,
      },
    });
    if (!query) throw new NotFound("Posts not found");

    await Queries.delete(query.id);
    return {
      message: "Query deleted successfully",
    };
  }

  async indexTopic() {
    const topic = await Topic.createQueryBuilder("topic").getMany();
    return topic;
  }

  async createAnswer(queriesId: number, userId: number, userInput: Answer) {
    const queries = await Queries.findOne({
      where: {
        id: queriesId,
      },
    });
    if (!queries) {
      throw new NotFound("Topic not found");
    }
    const answer = Answer.create({
      queries: queries,
      text: userInput.text,
      user_id: userId,
    });
    await answer.save();
    return await Answer.createQueryBuilder("answers")

      .select([
        "answers.id",
        "answers.text",
        "user.id",
        "user.user_name",
        "user.image",
      ])
      .where("answers.id = :id", { id: answer.id })
      .innerJoin("answers.user", "user")
      .orderBy("answers.created_at", "ASC")
      .getOne();
  }

  async index(topicName: string) {
    if (topicName === "All") {
      const queries: any = await Queries.createQueryBuilder("queries")
        .select([
          "queries.id",
          "queries.text",
          "queries.created_at",
          "user.id",
          "user.user_name",
          "user.image",
        ])
        .loadRelationCountAndMap("queries.answerCount", "queries.answer")
        .innerJoin("queries.user", "user")
        .orderBy("queries.created_at", "ASC")
        .getMany();
      return queries;
    }
    const topic = await Topic.findOne({
      where: {
        text: topicName,
      },
    });

    const queries = await Queries.createQueryBuilder("queries")
      .select([
        "queries.id",
        "queries.text",
        "user.id",
        "user.user_name",
        "user.image",
      ])
      .where("queries.topic_id = :id", { id: topic.id })
      .loadRelationCountAndMap("queries.answerCount", "queries.answer")
      .innerJoin("queries.user", "user")
      .orderBy("queries.created_at", "ASC")
      .getMany();
    return queries;
  }

  async create(topicName: string, userId: number, userInput: Queries) {
    const topic = await Topic.findOne({
      where: {
        text: topicName,
      },
    });
    if (!topic) {
      throw new NotFound("Topic not found");
    }
    const queries = Queries.create({
      topic: topic,
      text: userInput.text,
      user_id: userId,
    });

    await queries.save();

    return await Queries.createQueryBuilder("queries")

      .select([
        "queries.id",
        "queries.text",
        "user.id",
        "user.user_name",
        "user.image",
      ])
      .where("queries.id = :id", { id: queries.id })
      .loadRelationCountAndMap("queries.answerCount", "queries.answer")
      .innerJoin("queries.user", "user")
      .getOne();
  }

  async createTopic(userInput: Topic) {
    const topicFound = await Topic.findOne({
      where: {
        text: userInput.text,
      },
    });
    if (topicFound) throw new BadRequest("Topic already exist with that title");
    const topic = Topic.create(userInput);
    await topic.save();
    return {
      saved: true,
    };
  }

  async indexAnswers(queriesId: string) {
    const answers = await Answer.createQueryBuilder("answers")

      .select([
        "answers.id",
        "answers.text",
        "answers.created_at",
        "user.id",
        "user.user_name",
        "user.image",
        "user.is_verified"
      ])
      .where("answers.queries_id = :id", { id: queriesId })
      .innerJoin("answers.user", "user")
      .orderBy("answers.created_at", "ASC")
      .getMany();

    return answers;
  }
}

export default QueriesService;
