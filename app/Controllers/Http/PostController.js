'use strict'
const Post = use('App/Models/Post');

class PostController {
    async getById({ request, params, auth, response }) {
        const postId = params.postId;
        const post = await Post.find(postId);
        if(post != null){
            return response.status(200).json({
                status: "Success",
                post
            });
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Post not found"
            });
        }
    }

    async getByShop({ request, auth, response }){
        const shopId = params.shopId;
        const post = await Post.query().where("store_id",shopId).first();
        if(post != null){
            return response.status(200).json({
                status: "Success",
                post
            });
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Post not found"
            });
        }
    }

    async getAll({ response }){
        const posts = await Post.all();
        return response.status(200).json({
            status: "Success",
            rows: posts.rows.length,
            posts
        });
    }

    async create({ request, auth, response, params }){
        const shopId = params.shopId;
        const { title, body, status } = request.post();
        const post = new Post();
        post.title = title;
        post.body = body;
        post.status = status;
        try{
            await post.save();
            return response.status(201).json({
                status: "Success",
                post
            });
        } catch(e) {
            return response.status(400).json({
                status: "Error",
                message: "An error occured on create Post",
                stack_trace: e
            });
        }
    }

    async update({ request, auth, response }){
        const postId = params.postId;
        const { title, body, status } = request.post();
        const post = await Post.find(postId);
        if(post != null){
            post.title = title;
            post.body = body;
            post.status = status;
            try{
                await post.save();
                return response.status(200).json({
                    status: "Update succeed",
                    post
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on update Post",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Role not found",
                stack_trace: e
            });
        }
    }

    async delete({ request, auth, response }){
        const postId = params.postId;
        const post = await Post.find(postId);
        if(post != null){
            try{
                await post.delete();
                return response.status(200).json({
                    status: "Deletion succeed",
                });
            } catch(e) {
                return response.status(400).json({
                    status: "Error",
                    message: "An error occured on delete Post",
                    stack_trace: e
                });
            }
        } else {
            return response.status(404).json({
                status: "Error",
                message: "Post not found",
                stack_trace: e
            });
        }
    }
}

module.exports = PostController
