const { CommunityPost } = require('../mongodb');

class CommunityController {
    // Get community page with posts
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
                return res.status(400).json({ error: 'Post content is required.' });
            }
            
            if (text.length > 1000) {
                return res.status(400).json({ error: 'Post content too long (max 1000 characters).' });
            }

            const newPost = new CommunityPost({ 
                username: req.user.name, 
                text: text.trim() 
            });
            
            await newPost.save();
            res.redirect('/community');
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Server error. Please try again later.' });
        }
    }

    // Reply to post
    static async replyToPost(req, res) {
        try {
            const { text } = req.body;
            const { postId } = req.params;
            
            if (!text || text.trim().length === 0) {
                return res.status(400).json({ error: 'Reply content is required.' });
            }
            
            if (text.length > 500) {
                return res.status(400).json({ error: 'Reply content too long (max 500 characters).' });
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
            res.status(500).json({ error: 'Server error. Please try again later.' });
        }
    }
}

module.exports = CommunityController;
