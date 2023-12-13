import React from 'react'

import {
    Card,
    View,
    Heading,
    Flex,
    useTheme,
    Button,
  } from '@aws-amplify/ui-react';

const PostList = ({post, handleDeletePost}) => {
    const { tokens } = useTheme();


  return (
    <View
    backgroundColor={tokens.colors.background.info}
    padding={tokens.space.medium}
  >
    <Card>
        
        <Flex
          direction="row"
          alignItems="flex-start"
          gap={tokens.space.xs}
        >
          

          <Heading level={6}>
           {post?.title}
          </Heading>

          <Button onClick={()=>handleDeletePost(post?.id)} variation="destructive">Delete</Button>

        </Flex>
    </Card>
  </View>
  )
}

export default PostList