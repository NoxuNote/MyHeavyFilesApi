import { BadRequestException, Injectable} from '@nestjs/common';

import { Sequelize } from 'sequelize-typescript';
import { Access } from './models/Access';
import { Account } from './models/Account';

export const sequelize = new Sequelize({
        "dialect":"postgres",
        "host":"postgres",
        "port":5432,
        "username":process.env.POSTGRES_USER,
        "password":process.env.POSTGRES_PASSWORD,
        "database":process.env.POSTGRES_DB,
    models:[Access]
}).sync()

@Injectable()
export class AccessManagementService {

    async readAccesAllowed(uuidDocument: string, uuidUser: string) : Promise<Boolean>{
        const access = await Access.findOne({ 
            where: { 
              userUuid : uuidUser,
              documentUuid : uuidDocument
            } 
          })

        return access!= undefined && (access.role == "Owner" || access.role== "Reader")
    }

    async ownerAccesAllowed(uuidDocument: string, uuidUser: string) : Promise<Boolean>{
        const access = await Access.findOne({ 
            where: { 
              userUuid : uuidUser,
              documentUuid : uuidDocument
            } 
          })

        return access!= undefined && access.role == "Owner"
    }

    async addAccess(uuidDocument: string, uuidOwner: string, listUsersPseudo: string[], listRoles: string[]){
        if(listUsersPseudo.length != listRoles.length) throw new BadRequestException();

        //add the owner

        await Access.create({userUuid: uuidOwner, documentUuid: uuidDocument, role: "Owner"})

        for(let i = 0; i < listUsersPseudo.length; i++){
            
            const role = listRoles[i];
            if(role != "Owner" && role != "Reader") throw new BadRequestException("Unknown role");
            
            const uuid = await this.pseudoToUuid(listUsersPseudo[i])

            if(uuid){
                
                await Access.create({userUuid: uuid, documentUuid: uuidDocument, role: role})
            }
        }
    }

    async pseudoToUuid(pseudo:string): Promise<string>{

        const account = await Account.findOne({
            where:{
                nickname: pseudo
            }
        }
        )

        return "uuid"
    }

    async rightsOfUuid(uuidUser: string): Promise<string[]>{

        
        const access = await Access.findAll({ 
            where: { 
              userUuid : uuidUser
            } 
          })

        return access.map( a => a.documentUuid)
    }
}
