import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { createSlugFromText } from '../common/utils/create-slug-from-text';
import { User } from '../user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado!');
    }

    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findAllOwned(author: User) {
    const post = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findAll(postData: Partial<Post>) {
    const post = await this.postRepository.find({
      where: postData,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado!');
    }

    return post;
  }

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImageUrl,
      author,
    });

    const created = await this.postRepository.save(post).catch((err: unknown) => {
      if (err instanceof Error) {
        this.logger.error('Erro ao criar post', err.stack);
      } else {
        this.logger.error('Erro ao criar post', String(err));
      }

      throw new BadRequestException('Erro ao criar um post');
    });

    return created;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados!');
    }

    const post = await this.findOneOwnedOrFail(postData, author);

    if (dto.title && dto.title !== post.title) {
      post.slug = createSlugFromText(dto.title);
      post.title = dto.title;
    }
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.content = dto.content ?? post.content;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwnedOrFail(postData, author);

    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });

    return post;
  }
}
