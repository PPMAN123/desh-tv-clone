import React, { useState } from 'react';
import styled from 'styled-components';
import { client } from '../utils/graphqlRequest';
import { gql } from 'graphql-request';
import { PollData } from '../types/data';
import PollDataBar from './PollDataBar';

const PollBlockWrapper = styled.div`
  width: 80%;
  padding: 20px;
  margin: 5%;
  display: flex;
  flex-direction: column;
  background-color: #d6d8d7;
  border-radius: 12px;
  justify-content: space-between;
`;

const ImageWrapper = styled.img`
  max-width: 100%;
`;

const PollForm = styled.form``;

const Title = styled.h2`
  font-size: 20px;
  text-align: justify;
`;

const SelectionDiv = styled.div<{
  isSelected: boolean;
}>`
  width: 90%;
  height: 30px;
  margin: 10px 0;
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  border: 5px solid #008c75;
  transition: 0.5s ease-out;
  padding: 3px 5%;
  font-size: 20px;
  &:hover {
    background: #008c75;
    color: #fff;
  }
  background: ${(props) => (props.isSelected ? '#008c75' : '#d6d8d7')};
`;

const SubmissionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubmitButton = styled.button`
  font-family: Teko;
  font-size: 20px;
  width: 30%;
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  border: 5px solid #008c75;
  transition: 0.5s ease-out;
  &:hover {
    background: #008c75;
    color: #fff;
  }
`;

const MediaWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PollDataDiv = styled.div`
  width: 90%;
  height: 30px;
  margin: 10px 0;
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  border: 5px solid #008c75;
  transition: 0.5s ease-out;
  padding: 3px 5%;
  font-size: 20px;
`;

const TotalVotesDisplay = styled.div`
  height: 41px;
  font-size: 100%;
`;

const PollBlock = ({
  slug,
  date,
  title,
  imageData,
  yesCount,
  noCount,
  noCommentCount,
  deshYesCount,
  deshNoCount,
  deshNoCommentCount,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [pollData, setPollData] = useState({
    yesCount,
    noCount,
    noCommentCount,
    totalVotes: yesCount + noCount + noCommentCount,
  });

  const [selection, setSelection] = useState({
    yes: false,
    no: false,
    noComment: false,
  });

  const handleSelectionClick = (event) => {
    event.preventDefault();
    console.log(event.target.className);
    if (event.target.className.includes('yes')) {
      setSelection({
        yes: true,
        no: false,
        noComment: false,
      });
    }
    if (event.target.className.includes('no')) {
      setSelection({
        yes: false,
        no: true,
        noComment: false,
      });
    }
    if (event.target.className.includes('noc')) {
      setSelection({
        yes: false,
        no: false,
        noComment: true,
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    client
      .request(
        gql`
          mutation MyMutation(
            $slug: String = ""
            $no_comment_count: Int = 10
            $no_count: Int = 10
            $yes_count: Int = 10
          ) {
            updatePoll(
              where: { slug: $slug }
              data: {
                yes_count: $yes_count
                no_count: $no_count
                no_comment_count: $no_comment_count
              }
            ) {
              yes_count
              no_count
              no_comment_count
              desh_yes_count
              desh_no_comment_count
              desh_no_count
            }
          }
        `,
        {
          slug: slug,
          no_comment_count: selection.noComment
            ? noCommentCount + 1
            : noCommentCount,
          yes_count: selection.yes ? yesCount + 1 : yesCount,
          no_count: selection.no ? noCount + 1 : noCount,
        }
      )
      .then((data: { updatePoll: PollData }) => {
        console.log('SUBMITTED');
        const { updatePoll } = data;
        console.log(updatePoll);
        setPollData({
          yesCount: updatePoll.yes_count + updatePoll.desh_yes_count,
          noCount: updatePoll.no_count + updatePoll.desh_no_count,
          noCommentCount:
            updatePoll.no_comment_count + updatePoll.desh_no_comment_count,
          totalVotes:
            updatePoll.no_comment_count +
            updatePoll.desh_no_comment_count +
            updatePoll.no_count +
            updatePoll.desh_no_count +
            updatePoll.yes_count +
            updatePoll.desh_yes_count,
        });
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PollBlockWrapper>
      <MediaWrapper>
        <ImageWrapper src={imageData} />
        <Title>{title}</Title>
      </MediaWrapper>
      <SubmissionWrapper>
        {submitted ? (
          <>
            <PollDataBar
              voteName="yes"
              completed={(pollData.yesCount * 100) / pollData.totalVotes}
            />
            <PollDataBar
              voteName="no"
              completed={(pollData.noCount * 100) / pollData.totalVotes}
            />
            <PollDataBar
              voteName="noComment"
              completed={(pollData.noCommentCount * 100) / pollData.totalVotes}
            />

            <TotalVotesDisplay>
              <text>Total Votes: {pollData.totalVotes}</text>
            </TotalVotesDisplay>
          </>
        ) : (
          <>
            <SelectionDiv
              className="yes"
              isSelected={selection.yes}
              onClick={handleSelectionClick}
            >
              YES
            </SelectionDiv>
            <SelectionDiv
              className="no"
              isSelected={selection.no}
              onClick={handleSelectionClick}
            >
              NO
            </SelectionDiv>
            <SelectionDiv
              className="noc"
              isSelected={selection.noComment}
              onClick={handleSelectionClick}
            >
              NO COMMENT
            </SelectionDiv>

            <SubmitButton onClick={handleSubmit}>SUBMIT</SubmitButton>
          </>
        )}
      </SubmissionWrapper>
    </PollBlockWrapper>
  );
};

export default PollBlock;
