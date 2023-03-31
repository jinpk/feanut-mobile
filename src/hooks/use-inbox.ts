import {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {getPollingReceive} from '../libs/api/poll';
import {PagenatedRequest, PagenatedResponse} from '../libs/interfaces';
import {PollingReceiveItem} from '../libs/interfaces/polling';

export function useInbox() {
  const [query, setQuery] = useState<PagenatedRequest & {loading: boolean}>({
    page: 1,
    limit: 10,
    loading: false,
  });

  const [data, setData] = useState<PagenatedResponse<PollingReceiveItem>>({
    total: 0,
    data: [],
  });

  const fetchPollingReceives = async (params: PagenatedRequest) => {
    try {
      const data = await getPollingReceive(params);
      setData(prev => ({
        total: data.total,
        data: params.page === 1 ? [...data.data] : [...prev.data, ...data.data],
      }));
      setQuery(prev => ({...prev, loading: false}));
    } catch (error: any) {
      console.error(error);
      Alert.alert(error.message || error);
    }
  };

  useEffect(() => {
    if (query.loading) {
      let tm = setTimeout(() => {
        fetchPollingReceives(query);
      }, 500);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [query.page, query.limit, query.loading]);

  useEffect(() => {
    setQuery(prev => ({...prev, loading: true}));
  }, []);

  const handleNextPage = () => {
    if (data.data.length < data.total) {
      setQuery(prev => ({...prev, page: prev.page + 1, loading: true}));
    }
  };

  const handleRefresh = () => {
    setQuery(prev => ({...prev, page: 1, loading: true}));
  };

  return {
    pulls: data.data,
    loading: query.loading,
    nextPage: handleNextPage,
    refresh: handleRefresh,
  };
}
