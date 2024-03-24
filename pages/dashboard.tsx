import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardNav from '../src/components/DashboardNav';
import _ from 'lodash';
import { createAllArticles } from '../src/utils/createAllArticles';
import transferCategories from '../src/utils/transferCategories';
import ProgressBar from '../src/components/ProgressBar';
import transferRecommendedArticles from '../src/utils/transferRecommendedArticles';
import useCreateArticles from '../src/hooks/useCreateArticles';
import CreateArticlesSummary from '../src/components/CreateArticlesSummary';
import FetchForm from '../src/components/FetchForm';
import useTestApi from '../src/hooks/useTestApi';

const DashbaordPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (router && status !== 'authenticated') {
      router.push('/coolkidsonly');
    }
  }, [router, status]);

  const handleTransferCategories = (e) => {
    e.preventDefault();
    transferCategories();
  };

  const handleTransferRecommendedArticles = (e) => {
    e.preventDefault();
    transferRecommendedArticles();
  };

  const handleTestApi = (e) => {
    e.preventDefault();
    useTestApi();
  };

  if (status === 'authenticated' && session.user) {
    return (
      <DashbaordPageWrapper>
        <DashboardNav annotations={`Hello, ${session.user.email}`} />
        <FetchForm creationObject="polls" />
        <FetchForm creationObject="articles" />
        <button onClick={handleTransferCategories}>transfer categories</button>
        <button onClick={handleTransferRecommendedArticles}>
          transfer recommended articles
        </button>
        <button onClick={handleTestApi}>Test api</button>
      </DashbaordPageWrapper>
    );
  }

  return null;
};

export default dashboard;
