import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Character } from '../../characters/entities/character.entity';

@Entity('episodes')
export class Episode {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  apiId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  airDate?: string;

  @Column({ nullable: true })
  episodeCode?: string;

  @ManyToMany(() => Character, (character) => character.episodes)
  characters?: Character[];
}
