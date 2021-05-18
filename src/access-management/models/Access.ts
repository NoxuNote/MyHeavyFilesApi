import { Model, Table, Column, PrimaryKey, AllowNull } from "sequelize-typescript";

@Table
export class Access extends Model<Access> {

    @PrimaryKey
    @Column
    userUuid: string
    
    @PrimaryKey
    @Column
    documentUuid: string

    @AllowNull(false)
    @Column
    role: string


}