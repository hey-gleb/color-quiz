import React from 'react';

interface Props {
  title: string;
}

const QuestionTitle: React.FC<Props> = (props) => {
  return <h1 className="text-xl text-center font-bold mb-3">{props.title}</h1>;
};

export default QuestionTitle;
