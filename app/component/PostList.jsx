import React from 'react'

import {
    Card,
    View,
    Heading,
    Flex,
    useTheme,
    Button,
  } from '@aws-amplify/ui-react';
import Avatar from './Avatar';

const PostList = ({post, handleDeletePost}) => {
    const { tokens } = useTheme();


  return (
    <View
    backgroundColor={tokens.colors.background.info}
    padding={tokens.space.medium}
    width={'70%'}
  >
    <Card>
        
        <Flex
          direction="row"
          // alignItems="flex-start"
          justifyContent={'space-between'}
          gap={tokens.space.xs}
        >
          
          <Flex direction="row" justifyContent="flex-start">
              <Avatar userName={post?.username} />
              <Heading level={6}>{post?.title}</Heading>
            </Flex>
          

          <Button onClick={()=>handleDeletePost(post?.id)} variation="destructive">Delete</Button>

        </Flex>
    </Card>
  </View>
  )
}

export default PostList