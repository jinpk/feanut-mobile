import {useCallback, useEffect, useState} from 'react';
import {deletePollings, getPollingReceive} from '../libs/api/poll';
import {PagenatedRequest, PagenatedResponse} from '../libs/interfaces';
import {PollingReceiveItemWrap} from '../libs/interfaces/polling';
import {Alert} from 'react-native';

export function useInbox() {
  const [query, setQuery] = useState<PagenatedRequest & {loading: boolean}>({
    page: 1,
    limit: 10,
    loading: false,
  });

  const [data, setData] = useState<PagenatedResponse<PollingReceiveItemWrap>>({
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
      if (__DEV__) {
        console.error(error);
      }
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
    if (data.data.length < data.total && !query.loading) {
      setQuery(prev => ({...prev, page: prev.page + 1, loading: true}));
    }
  };

  const handleRefresh = () => {
    setQuery(prev => ({...prev, page: 1, loading: true}));
  };

  const onSelect = useCallback((_id: string) => {
    setData(prev => ({
      ...prev,
      data: [
        ...prev.data.map((x, i) => {
          if (x._id === _id) {
            x.selected = !x.selected;
          }
          return x;
        }),
      ],
    }));
  }, []);

  const [deleting, setDeleting] = useState(false);
  const handleDeletePulls = useCallback(async () => {
    const selectedIds = data.data.filter(x => x.selected).map(x => x._id);
    if (!selectedIds.length) return;

    Alert.alert(
      `${selectedIds.length}개의 받은 칭찬 삭제하기`,
      '칭찬 삭제는 되돌릴 수 없습니다.',
      [
        {text: '취소'},
        {
          text: '삭제',
          isPreferred: true,
          onPress: async () => {
            setDeleting(true);
            try {
              await deletePollings(selectedIds.join(','));
              setQuery({
                page: 1,
                limit: 10,
                loading: true,
              });
            } catch (error: any) {
              Alert.alert(error.message);
            }
            setDeleting(false);
          },
        },
      ],
    );
  }, [data.data]);

  return {
    pulls: data.data,
    loading: query.loading,
    nextPage: handleNextPage,
    refresh: handleRefresh,
    select: onSelect,
    deletePulls: handleDeletePulls,
    deleting,
  };
}
