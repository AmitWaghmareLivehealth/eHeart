import NetworkRequest from '../../../utils/handlers/network';
import {URLs} from '../../../utils/const/urls';
import Global from '../../../utils/const/globals';

export const submitQuery = async (token, query, user) => {
  try {
    const res = await fetch(URLs.sendQuery, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Connection: 'close',
      },
      body: `token=${token}&labId=${Global.labId}&query=${query}
      &userEmail=${user.user.email}
      &userPhone=${user.contact}
      &userName=${user.fullName}
      `,
    })
      .then(res => res.json())
      .then(res => res);

    return res && res.code === 200;
  } catch (err) {
    return false;
    throw err;
  }
};
