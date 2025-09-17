const { CommunityPost } = require('../mongodb');

class CommunityController {
    static async getCommunity(req, res) {
        try {
            const posts = await CommunityPost.find()
                .sort({ createdAt: -1 })
                .limit(50)
                .lean();
            
            res.render('community', { 
                user: req.user || null, 
                posts,
                currentPage: 'community'
            });
        } catch (error) {
            console.error('Error fetching community posts:', error);
            res.status(500).render('community', { 
                user: req.user || null, 
                posts: [],
                error: 'Failed to load posts',
                currentPage: 'community'
            });
        }
    }

    // Create new post
    static async createPost(req, res) {
        try {
            const { text } = req.body;
            
            if (!text || text.trim().length === 0) {
                const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
                return res.status(400).render('community', { error: 'Post content cannot be empty.', user: req.user, posts, currentPage: 'community' });
            }
            
            if (text.length > 1000) {
                const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
                return res.status(400).render('community', { error: 'Post content too long (max 1000 characters).', user: req.user, posts, currentPage: 'community' });
            }

            const newPost = new CommunityPost({ 
                username: req.user.name, 
                text: text.trim() 
            });
            
            await newPost.save();
            res.redirect('/community');
        } catch (error) {
            console.error('Error creating post:', error);
            const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
            res.status(500).render('community', { error: 'Server error. Please try again later.', user: req.user, posts, currentPage: 'community' });
        }
    }

    // Reply to post
    static async replyToPost(req, res) {
        try {
            const { text } = req.body;
            const { postId } = req.params;
            
            if (!text || text.trim().length === 0) {
                const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
                return res.status(400).render('community', { error: 'Reply content cannot be empty.', user: req.user, posts, currentPage: 'community' });
            }
            
            if (text.length > 500) {
                const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
                return res.status(400).render('community', { error: 'Reply content too long (max 500 characters).', user: req.user, posts, currentPage: 'community' });
            }

            const post = await CommunityPost.findById(postId);
            if (!post) {
                return res.status(404).json({ error: 'Post not found.' });
            }
            
            post.replies.push({ 
                username: req.user.name, 
                text: text.trim() 
            });
            
            await post.save();
            res.redirect('/community');
        } catch (error) {
            console.error('Error replying to post:', error);
            const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50).lean();
            res.status(500).render('community', { error: 'Server error. Please try again later.', user: req.user, posts, currentPage: 'community' });
        }
    }
}

module.exports = CommunityController;
