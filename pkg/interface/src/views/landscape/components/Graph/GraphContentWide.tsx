import { Box } from '@tlon/indigo-react';
import { Content, Post, ReferenceContent } from '@urbit/api';
import React from 'react';
import GlobalApi from '~/logic/api/global';
import { referenceToPermalink } from '~/logic/lib/permalinks';
import { PropFunc } from '~/types';
import { PermalinkEmbed } from '~/views/apps/permalinks/embed';
import { Mention } from '~/views/components/MentionText';
import RemoteContent from '~/views/components/RemoteContent';
import CodeContent from './content/code';
import TextContent from './content/text';

function GraphContentWideInner(
  props: {
    transcluded?: number;
    post: Post;
    api: GlobalApi;
    showOurContact: boolean;
  } & PropFunc<typeof Box>
) {
  const { post, transcluded = 0, showOurContact, api, ...rest } = props;

  return (
    <Box {...rest}>
      {post.contents.map((content: Content, i) => {
        if ('text' in content) {
          return (
            <TextContent
              key={i}
              api={api}
              fontSize={1}
              lineHeight={'20px'}
              content={content}
            />
          );
        } else if ('code' in content) {
          return <CodeContent key={i} content={content} />;
        } else if ('reference' in content) {
          const { link } = referenceToPermalink(content as ReferenceContent);
          return (
            <PermalinkEmbed
              link={link}
              api={api}
              transcluded={transcluded}
              showOurContact={showOurContact}
            />
          );
        } else if ('url' in content) {
          return (
          <Box
            key={i}
            flexShrink={0}
            fontSize={1}
            lineHeight="20px"
            color="black"
            width="fit-content"
            maxWidth="min(500px, 100%)"
          >
            <RemoteContent
              key={content.url}
              url={content.url}
              transcluded={transcluded}
            />
          </Box>
          );
        } else if ('mention' in content) {
          const first = i => i === 0;
          return (<Mention
            key={i}
            first={first(i)}
            ship={content.mention}
            api={api}
                  />);
        }
      })}
    </Box>
  );
}

export const GraphContentWide = React.memo(GraphContentWideInner);
