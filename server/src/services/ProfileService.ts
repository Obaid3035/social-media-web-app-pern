import { Service } from "typedi";
import Profile from "../entities/Profile";
import User from "../entities/User";
import { BadRequest } from "../utils/errorCode";

@Service()
class ProfileService {
  async create(currUser: User, userInput: Profile) {
    if (currUser.profile_setup) {
      throw new BadRequest("Profile already exists");
    }
    const profile = Profile.create({
      dob: userInput.dob,
      gender: userInput.gender,
      height_feet: userInput.height_feet,
      height_inches: userInput.height_inches,
      weight: userInput.weight,
      weight_unit: userInput.weight_unit,
      user: currUser
    });
    const savedProfile = await profile.save();
    if (!savedProfile) {
      throw new Error("Something went wrong");
    }
    currUser.profile_setup = true;
    const user = await currUser.save();
    const token = user.generateToken();
    return {
      saved: true,
      token,
    };
  }

  async show(currUserId: number) {
    return await Profile.findOne({
      where: {
        user_id: currUserId,
      },
    });
  }

  async update(currUserId: number, userInput: Profile) {
    await Profile.createQueryBuilder("profile")
      .update({
        dob: userInput.dob,
        weight: userInput.weight,
        weight_unit: userInput.weight_unit,
        height_feet: userInput.height_feet,
        height_inches: userInput.height_inches
      })
      .where({
        user_id: currUserId,
      })
      .execute()


    return {
      updated: true,
    };
  }
}

export default ProfileService;
