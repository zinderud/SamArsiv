import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'tb_archive' })
export class ArchiveEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    d_no: string;
    @Column()
    s_no: string;
    @Column()
    name: string;
    @Column()
    tc: number;
}
