import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryColumn({ name: 'ID', type: 'number' })
  id: number;

  @Column({ name: 'NAME', type: 'varchar2', length: 100, nullable: true })
  name: string;

  @Column({ name: 'EMAIL', type: 'varchar2', length: 255, nullable: true })
  email: string;

  @Column({ name: 'CREATED_AT', type: 'date', nullable: true })
  createdAt: Date;

  @Column({ name: 'UPDATED_AT', type: 'date', nullable: true })
  updatedAt: Date;
}
