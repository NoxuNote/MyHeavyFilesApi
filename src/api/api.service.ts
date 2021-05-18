import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {Express} from 'express';
import multer, {Multer} from 'multer';
import {extname} from 'path';
import {writeFileSync, readFileSync, readdirSync, unlinkSync} from 'fs';
import { AccessManagementService } from 'src/access-management/access-management.service';


const MOUNT_DIRECTORY = "/usr/src/uploadedFiles/"

@Injectable()
export class ApiService {
    constructor(
        private accesMgtServ: AccessManagementService
    ){}
    async deleteDocumentsByUuid(uuid: string, uuidUser: string) {
        try{
            let data = readFileSync(MOUNT_DIRECTORY + uuid)
        }catch(err){
            if(err.code === "ENOENT") throw new NotFoundException("This ressource doesn't exist");
        }
        if(!(await this.accesMgtServ.ownerAccesAllowed(uuid, uuidUser))) throw new UnauthorizedException("You don't have access to this ressource")
        try{
            unlinkSync(MOUNT_DIRECTORY + uuid)
        }catch(err){
        }
    }
    async getDocumentByUuid(uuid: string, uuidUser: string) {
        //check if user is allowed to access to the document

        if(! (await this.accesMgtServ.readAccesAllowed(uuid, uuidUser))) throw new ForbiddenException("You don't have acces to this ressource")
        const path : string = MOUNT_DIRECTORY + uuid
        let data;
        try{
            data = readFileSync(path)
            return data
        }catch(err){
            if(err.code === "ENOENT") throw new NotFoundException();
        }
        
        throw new InternalServerErrorException();
        
    }
    async sendDocument(file: Express.Multer.File, uuidUser: string, listUsersPseudo: string[], listRoles: string[]) {
        const uuid : string = uuidv4();
        const filename : string = uuid + extname(file.originalname);
        const path : string = MOUNT_DIRECTORY + filename;
        if(listUsersPseudo == undefined && listRoles == undefined){
            listUsersPseudo = []
            listRoles = []
        }
        else if(listUsersPseudo == undefined || listRoles == undefined)throw new BadRequestException("You defined only one of this two lists : "
                                                                                                    +"the list of the users you want to give acces to your file "
                                                                                                    +"and the list of the roles you want to give them.");
        else if(listUsersPseudo.length != listRoles.length) throw new BadRequestException("You didn't give the same number of pseudo and roles.");

        try{
            writeFileSync(path, file.buffer);
        }catch(err){
            throw new InternalServerErrorException("An error occured during file registration");
        }

        await this.accesMgtServ.addAccess(filename, uuidUser, listUsersPseudo, listRoles);

        return filename;

    }
    async getDocuments(uuidUser : string) {
        return await this.accesMgtServ.rightsOfUuid(uuidUser)
    }
}
