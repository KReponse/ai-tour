const API =
  'http://localhost:5000/api/provider/tours';

export const getTours =
  async () => {

    const res =
      await fetch(API);

    return res.json();

};

export const createTour =
  async (tourData) => {

    const res =
      await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify(
          tourData
        ),
      });

    return res.json();

};

export const updateTour =
  async (
    id,
    tourData
  ) => {

    const res =
      await fetch(
        `${API}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(
            tourData
          ),
        }
      );

    return res.json();

};

export const deleteTour =
  async (id) => {

    const res =
      await fetch(
        `${API}/${id}`,
        {
          method: 'DELETE',
        }
      );

    return res.json();

};