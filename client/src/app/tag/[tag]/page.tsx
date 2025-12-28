import type { FC } from 'react';

const TagPageList: FC<{ params: { tag: string } }> = ({ params }) => {
  return (
    <div>
      <h1>{params.tag}</h1>
      <p>TagPageList</p>
    </div>
  );
};

export default TagPageList;