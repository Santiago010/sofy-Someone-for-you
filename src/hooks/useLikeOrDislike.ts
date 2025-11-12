import {useState} from 'react';
import {privateDB} from '../db/db';
import {LikeResponse} from '../interfaces/interfacesApp';

export function useLikeOrDislike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const like = async (targetIndividualId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await privateDB.post<LikeResponse>('/individuals/like', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        targetIndividualId: targetIndividualId,
      });
      setLoading(false);
      return response.data.message;
    } catch (err: any) {
      setLoading(false);
      setError('Error in the request Like');
    }
  };

  const dislike = async (targetIndividualId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await privateDB.post<LikeResponse>(
        '/individuals/dislike',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          targetIndividualId: targetIndividualId,
        },
      );
      setLoading(false);
      return response.data.message;
    } catch (err: any) {
      setLoading(false);
      setError('Error in the request dislike');
    }
  };

  return {like, dislike, loading, error};
}
