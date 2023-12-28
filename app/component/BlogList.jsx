import { createPost, deleteBlog, deletePost } from "@/src/graphql/mutations";
import { getPost, listPosts } from "@/src/graphql/queries";
import {
  Card,
  Image,
  View,
  Heading,
  Flex,
  Badge,
  Text,
  Button,
  useTheme,
  TextField,
  Alert,
} from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { useEffect, useState } from "react";
import PostList from "./PostList";
import Avatar from "./Avatar";

const BlogList = ({
  blog,
  handleDeleteBlogPost,
  blogDeleteError,
  username,
}) => {
  const { tokens } = useTheme();

  const [postTitle, setPostTitle] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const { data } = await API.graphql({
      query: createPost,
      authMode: "AMAZON_COGNITO_USER_POOLS",
      variables: {
        input: {
          blogPostsId: blog?.id,
          title: postTitle,
          username,
        },
      },
    });
    setPostTitle("");
    setPosts([...posts, data.createPost]);
  };

  const handleDeletePost = async (postId) => {
    try {
      const deletePostData = await API.graphql({
        query: deletePost,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: { id: postId },
        },
      });
      getAllPost();
      // console.log("deletePostData",deletePostData);
    } catch (error) {
      console.log("error");
      Array.isArray(error?.errors) &&
        error?.errors[0].errorType === "Unauthorized" &&
        setError(
          `You are not authorize to delete this post. Error: ${error?.errors[0].message}`
        );
    }
  };

  const getAllPost = () => {
    try {
      API.graphql({
        query: listPosts,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          filter: { blogPostsId: { eq: blog?.id } },
        },
      }).then(({ data }) => {
        setPosts(data?.listPosts?.items);
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, [2500]);
    }
  }, [error]);

  useEffect(() => {
    getAllPost();
  }, []);

  return (
    <View
      backgroundColor={tokens.colors.background.secondary}
      padding={tokens.space.medium}
    >
      {error ? (
        <Alert
          variation="error"
          isDismissible={true}
          onDismiss={() => setError("")}
        >
          {error}
        </Alert>
      ) : (
        ""
      )}
      <Card>
        <Flex direction="column" alignItems="flex-start" gap={tokens.space.xs}>
          <Flex direction="row" justifyContent="space-between" width="100%">
            {" "}
            <Flex direction="row" justifyContent="flex-start">
              <Avatar userName={blog?.username} />
              <Heading level={5}>{blog?.name}</Heading>
            </Flex>
            <Flex
              direction="column"
              //   justifyContent="space-between"
            >
              {blogDeleteError.id !== blog.id ? (
                <Button
                  onClick={() => handleDeleteBlogPost(blog.id)}
                  variation="destructive"
                >
                  Delete
                </Button>
              ) : (
                <Alert variation="error"> {blogDeleteError?.message} </Alert>
              )}
            </Flex>
          </Flex>
          <View
            backgroundColor={tokens.colors.background.secondary}
            padding={tokens.space.medium}
          >
            <form onSubmit={handleCreatePost}>
              <Flex direction="row" alignItems="end" gap={tokens.space.xs}>
                <TextField
                  placeholder="Create title for post"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
                <Button variation="primary" type="submit">
                  {" "}
                  Create Post Comment
                </Button>
              </Flex>
            </form>
          </View>

          {posts?.map((post) => {
            return (
              <PostList
                post={post}
                key={post?.id}
                handleDeletePost={handleDeletePost}
              />
            );
          })}
        </Flex>
      </Card>
    </View>
  );
};

export default BlogList;
