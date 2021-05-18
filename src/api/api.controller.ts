import { Headers, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { ApiService } from './api.service';
import {Response} from 'express'
import {contentType} from 'mime-types'


@ApiTags('documents')
@Controller('documents')
export class ApiController {
    constructor(
        private service : ApiService
    ){}
    
    @Get()
    @ApiResponse({description:"Renvoie la liste des documents de l'utilisateur", status:200})
    @ApiResponse({description:"L'utilisateur n'a pas de document", status:204})
    async getDocuments(@Headers("x-api-user-id") uuidUser: string){
        return await this.service.getDocuments(uuidUser) 
    }

    @Post()
    @ApiResponse({description: "Le document a bien été uploadé", status:201})
    @ApiResponse({description: "Le document n'a pas pu être créé", status:405})
    @UseInterceptors(FileInterceptor('file'))
    async sendDocuments(@UploadedFile() file: Express.Multer.File, @Headers("x-api-user-id") uuidUser: string, @Body("listPseudos") listPseudo : string[], @Body("listRoles") listRoles: string[]){
        return await this.service.sendDocument(file, uuidUser, listPseudo, listRoles)
    }


    @ApiParam({name: "uuid", description: "The Uuid of the document you want to get"})
    @ApiResponse({description: "Renvoie le document correspondant à l'uuid", status: 200})
    @ApiResponse({description: "Il n'existe pas de document avec l'uuid correspondant", status:404})
    @Get(':uuid')
    async getDocumentByUuid(@Param() parameter, @Res() res: Response, @Headers("x-api-user-id") uuidUser: string){
        const buffer = await this.service.getDocumentByUuid(parameter.uuid, uuidUser)

        const extension = parameter.uuid.split('.').pop()

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);


        const mime_type = contentType(extension)
        
        if(mime_type){
        res.set({
            'Content-Type': mime_type,
            'Content-Length' : buffer.length
        })}
        else{
            
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Length' : buffer.length
        })}

        stream.pipe(res);


    }

    @ApiParam({name: "uuid", description: "The Uuid of the document you want to get"})
    @ApiResponse({description: "Le document a été supprimé avec succès", status: 200})
    @ApiResponse({description: "Il n'existe pas de document avec l'uuid correspondant", status:404})
    @Delete(':uuid')
    async deleteDocumentByUuid(@Param() parameter, @Headers("x-api-user-id") uuidUser: string){
        return await this.service.deleteDocumentsByUuid(parameter.uuid, uuidUser)
    }

    @ApiParam({name: "uuid", description: "The Uuid of the document you want to get"})
    @ApiResponse({description: "Renvoie le document correspondant à l'uuid pour téléchargement", status:200})
    @ApiResponse({description: "Il n'existe pas de document avec l'uuid correspondant", status:404})
    @Get(":uuid/download")
    async downloadDocumentByUuid(@Param() parameter, @Res() res: Response, @Headers("x-api-user-id") uuidUser: string){
        const buffer = await this.service.getDocumentByUuid(parameter.uuid, uuidUser)

        const name = parameter.uuid

        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);

        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition' : 'attachement; filename="'+name+'"' ,
            'Content-Length' : buffer.length,
        })

        stream.pipe(res);

    }    

}
