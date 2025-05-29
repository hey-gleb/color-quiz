import React from 'react';

interface Props {
  children: React.ReactNode;
}

const QuestionTitle: React.FC<Props> = (props) => {
  return (
    <h1 className="text-xl text-center font-bold mb-3">{props.children}</h1>
  );
};

export default QuestionTitle;
