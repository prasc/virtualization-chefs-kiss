import React, { useCallback, useEffect, useState } from 'react';
import debounce from '../helpers/debounce';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

type Player = {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  team: string;
};

type Data = {
  data: Player[];
};
export const Online = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const size = 2;

  const fetchPlayers = async (offset: number) => {
    const cachedPlayers = localStorage.getItem(offset.toString());
    if (cachedPlayers) {
      const playerResponse = JSON.parse(cachedPlayers);
      setPlayers((prevPlayers) => [...prevPlayers, ...playerResponse]);
      setOffset((prevOffset) => prevOffset + playerResponse.length);
      setIsLoading(false);
      return;
    }
    if (isLoading) return;
    setIsLoading(true);

    const response = await fetch(
      `http://localhost:3000/players?offset=${offset}&size=${size}`
    );
    const data: Data = await response.json();

    if (response.ok) {
      const playerResponse = data.data;
      localStorage.setItem(offset.toString(), JSON.stringify(playerResponse));
      setOffset((prevOffset) => prevOffset + playerResponse.length);
      setPlayers((prevPlayers) => [...prevPlayers, ...playerResponse]);
    } else {
      console.error('data: ', data);
    }
    setIsLoading(false);
  };

  const timer = useCallback(debounce(fetchPlayers, 300), []);

  useEffect(() => {
    const validateAndFetch = (e: Event) => {
      const scrolledTo = window.scrollY + window.innerHeight;
      const threshold = 300;
      const isReachBottom =
        document.body.scrollHeight - threshold <= scrolledTo;
      if (isReachBottom) {
        // timer(offset);
      }
    };

    document.addEventListener('scroll', validateAndFetch);
  }, [offset]);

  useEffect(() => {
    fetchPlayers(offset);
  }, []);

  const Row = ({ index, style }) => {
    if (!players[index]) return;
    return (
      <div style={style}>
        {players[index].first_name}
        {players[index].last_name}
        {players[index].position}
      </div>
    );
  };

  // return <div>{JSON.stringify(players)}</div>;
  return (
    <>
      <div style={{ height: 40 }}>
        {isLoading && <span>Currently loading....</span>}
      </div>
      <div style={{ border: '2px solid red' }}>
        <InfiniteLoader
          isItemLoaded={(index) => Boolean(players[index])}
          itemCount={1000}
          // loadMoreItems={() => timer(offset)}
          loadMoreItems={(newOffset) => fetchPlayers(newOffset)}
        >
          {({ onItemsRendered, ref }) => (
            <FixedSizeList
              itemCount={players.length}
              onItemsRendered={onItemsRendered}
              ref={ref}
              height={300}
              width={300}
              itemSize={50}
            >
              {Row}
            </FixedSizeList>
          )}
        </InfiniteLoader>
      </div>
    </>
  );
};
