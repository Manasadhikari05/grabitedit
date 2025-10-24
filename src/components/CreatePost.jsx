import { useState, useRef } from 'react';
import { Search, X, Smile, Image, Paperclip } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(['study-group', 'share-insight', 'help-question']);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const getAvatarUrl = () => {
    if (user.profileImage) {
      return user.profileImage;
    }

    const avatarStyle = lorelei;
    const avatar = createAvatar(avatarStyle, {
      seed: user.name || user.email,
      size: 40,
    });
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);

      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const emojis = ['😀', '😂', '😊', '😍', '🥰', '😘', '😉', '😎', '🤔', '😮', '😢', '😭', '😤', '😡', '🥺', '😴', '🤤', '😵', '🤐', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👏', '🙌', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '❇️', '™️', '©️', '®️', '👁️‍🗨️', '🔇', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💼', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '❇️', '™️', '©️', '®️', '👁️‍🗨️', '🔇', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💼', '🩸', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '❇️', '™️', '©️', '®️', '👁️‍🗨️', '🔇', '🔕', '📣', '📢', '💬', '💭', '🗯️', '♠️', '♣️', '♥️', '♦️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💼'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to create a post');
        return;
      }

      let imageUrl = null;
      let imagePublicId = null;

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('image', selectedImage);

        console.log('Starting image upload...'); // Debug log
        const uploadResponse = await fetch('http://localhost:5001/api/upload/post-image', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        console.log('Upload response:', uploadData); // Debug log

        if (uploadData.success) {
          imageUrl = uploadData.imageUrl;
          imagePublicId = uploadData.publicId;
          console.log('Image uploaded successfully:', imageUrl); // Debug log
        } else {
          console.error('Upload failed:', uploadData); // Debug log
          alert('Failed to upload image. Please try again.');
          setLoading(false);
          return;
        }
      }

      const requestBody = {
        title: title.trim(),
        content: content.trim(),
        tags: tags,
        imageUrl,
        imagePublicId
      };
      console.log('Creating post with data:', requestBody); // Debug log

      const response = await fetch('http://localhost:5001/api/auth/discussion-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Post creation response:', data); // Debug log

      if (data.success) {
        alert('Post created successfully!');
        // Reset form
        setTitle('');
        setContent('');
        setTags(['study-group', 'share-insight', 'help-question']);
        setSelectedImage(null);
        setImagePreview(null);
        // Optionally refresh the discussion list
        window.location.reload();
      } else {
        alert(data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl()}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg" style={{ fontWeight: 600 }}>
                {user.name || user.email?.split('@')[0] || 'User'}
              </h2>
              <p className="text-gray-500" style={{ fontSize: '13px' }}>
                @{user.name?.toLowerCase().replace(' ', '') || user.email?.split('@')[0] || 'user'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              // Reset all form data
              setTitle('');
              setContent('');
              setTags(['study-group', 'share-insight', 'help-question']);
              setNewTag('');
              setSelectedImage(null);
              setImagePreview(null);
              setShowEmojiPicker(false);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="w-10 h-10 rounded-full bg-[#FF6B55] flex items-center justify-center hover:bg-[#FF5542] transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full border border-gray-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#FF6B55] focus:border-transparent"
            style={{ fontSize: '16px', fontWeight: 600 }}
            required
          />

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border border-gray-200 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B55] focus:border-transparent"
            rows={8}
            style={{ fontSize: '15px', lineHeight: '1.6' }}
            required
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Selected"
                className="max-w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="absolute z-50 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg max-w-xs">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">Choose an emoji</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="w-6 h-6 text-gray-400 hover:text-gray-600 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                {emojis.slice(0, 64).map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiClick(emoji)}
                    className="w-8 h-8 text-xl hover:bg-gray-100 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-gray-500" style={{ fontSize: '14px' }}>Tags:</span>
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 flex items-center gap-1"
              style={{ fontSize: '13px' }}
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))}
          <div className="flex gap-1">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag..."
              className="px-3 py-1 border border-gray-200 rounded-full text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF6B55] focus:border-[#FF6B55]"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-1 border border-[#FF6B55] text-[#FF6B55] rounded-full hover:bg-[#FF6B55] hover:text-white transition-colors"
              style={{ fontSize: '13px' }}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Smile size={18} className="text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Image size={18} className="text-gray-600" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-[#FF6B55] text-white rounded-lg hover:bg-[#FF5542] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
}