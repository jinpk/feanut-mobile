import React, {memo, useCallback, useState} from 'react';
import {FriendItem} from '../components';
import {UserRecommendation} from '../libs/interfaces';
import {colors} from '../libs/common';
import {postFriend, postFriendByUser} from '../libs/api/friendship';
import {Alert} from 'react-native';

type FriendFindItemProps = {
  item: UserRecommendation;
  onPress: () => void;
  userId: string;
  onAdd: () => void;
};

function FriendFindItem(props: FriendFindItemProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = useCallback(() => {
    const promise = props.item.userId
      ? postFriendByUser(props.userId, props.item.userId!, props.item.name)
      : postFriend(props.userId, {
          phoneNumber: props.item.phoneNumber!,
          name: props.item.name,
        });

    promise
      .then(props.onAdd)
      .catch((err: any) => {
        Alert.alert(err.message || err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <FriendItem
      gender={props.item.gender}
      desc={
        props.item.school
          ? `${props.item.school.name} ${props.item.school.grade}`
          : ''
      }
      name={props.item.name}
      profileImageKey={props.item.profileImageKey}
      onPress={props.item.userId ? props.onPress : undefined}
      buttonLoading={loading}
      onButtonPress={handleAdd}
      button="친구 추가"
      buttonColor={colors.blue}
    />
  );
}

export default memo(FriendFindItem);
