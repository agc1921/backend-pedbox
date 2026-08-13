import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Location } from '../../locations/entities/location.entity';
import { Episode } from '../../episodes/entities/episode.entity';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  apiId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  species?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @ManyToOne(() => Location, (location) => location.characters, { nullable: true })
  location?: Location;

  @ManyToMany(() => Episode, (episode) => episode.characters)
  @JoinTable({ name: 'character_episode' })
  episodes?: Episode[];
}
