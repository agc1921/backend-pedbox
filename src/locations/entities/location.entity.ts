import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  apiId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  dimension?: string;

  @OneToMany(() => Character, (character) => character.location)
  characters?: Character[];
}
