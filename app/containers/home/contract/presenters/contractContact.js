/**
 * Created by Joe on 2017/5/9.
 */

// common
import {contractContact} from '../../../../constants/operation/contractManage'

export function getTitle(status){
  let title = '';
  for(var z of contractContact){
    if(z.status===status){
      title = z.title;
      break;
    }
  }
  return title;
}
