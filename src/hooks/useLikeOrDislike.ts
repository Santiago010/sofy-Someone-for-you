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
      return true;
    } catch (err) {
      console.error('Error in the request Like');
      return false;
    }
  };

  const superlike = async (targetIndividualId: number) => {
    try {
      const response = await privateDB.post<LikeResponse>(
        '/individuals/super-like',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          targetIndividualId: targetIndividualId,
        },
      );
      return true;
    } catch (err) {
      console.error('Error in the request Like');
      return false;
    }
  };

  const compliment = async (targetIndividualId: number, message: string) => {
    try {
      const response = await privateDB.post<LikeResponse>(
        '/individuals/compliment',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          targetIndividualId: targetIndividualId,
          message: message,
        },
      );
      return true;
    } catch (err) {
      console.error('Error in the request Like');
      return false;
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
      return true;
    } catch (err) {
      console.error('Error in the request dislike');
      return false;
    }
  };

  return {like, dislike, superlike, compliment};
}
