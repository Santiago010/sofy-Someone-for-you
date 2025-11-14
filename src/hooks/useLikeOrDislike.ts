import {privateDB} from '../db/db';
import {LikeResponse} from '../interfaces/interfacesApp';

export function useLikeOrDislike() {
  const like = async (targetIndividualId: number) => {
    try {
      await privateDB.post<LikeResponse>('/individuals/like', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        targetIndividualId: targetIndividualId,
      });
      console.log(`like hecho satisfactoriamente a: ${targetIndividualId}`);
    } catch (err) {
      console.error('Error in the request Like');
    }
  };

  const dislike = async (targetIndividualId: number) => {
    try {
      await privateDB.post<LikeResponse>('/individuals/dislike', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        targetIndividualId: targetIndividualId,
      });
      console.log(`dislike hecho satisfactoriamente a: ${targetIndividualId}`);
    } catch (err) {
      console.error('Error in the request dislike');
    }
  };

  return {like, dislike};
}
