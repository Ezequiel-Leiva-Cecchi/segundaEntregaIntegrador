import { usersModel } from "../../models/users.model.js";

export class usersMongoose{
    async addUsers(object){
        const users = new usersModel(object);
        await users.save()
        return users.toObject({virtuals:true});
    }
}