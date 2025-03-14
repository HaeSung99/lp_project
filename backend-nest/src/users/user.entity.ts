import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  password: string;

  @Column({ unique: true })
  clientId: string;

  @Column({ length: 1000 })
  apiKey: string;

  @CreateDateColumn({ type: 'timestamp' }) // 생성 시 자동 설정
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' }) // 업데이트 시 자동 설정
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true }) // 소프트 삭제 시 자동 설정
  deletedAt?: Date | null;
}
