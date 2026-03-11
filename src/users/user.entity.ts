import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryColumn({ name: 'ID', type: 'number' })
  id: number;

  @Column({ name: 'USERNAME', type: 'varchar2', length: 100 })
  username: string;

  @Column({ name: 'EMAIL', type: 'varchar2', length: 255 })
  email: string;

  @Column({ name: 'FIRST_NAME', type: 'varchar2', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'LAST_NAME', type: 'varchar2', length: 100, nullable: true })
  lastName: string;

  @Column({ name: 'IS_ACTIVE', type: 'number', default: 1 })
  isActive: number;

  @Column({ name: 'CREATED_AT', type: 'date', nullable: true })
  createdAt: Date;

  @Column({ name: 'UPDATED_AT', type: 'date', nullable: true })
  updatedAt: Date;
}
