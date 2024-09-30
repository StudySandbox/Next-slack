import { useQueryState } from "nuqs";

// nuqs 는 State 를 api 와 연결해주는 라이브러리 입니다.
// ex. const [parentMessageId, setParentMessageId] = useState(123); <=> http://localhost:3000?parentMessageId=123
export const useProfileMemberId = () => {
  return useQueryState("profileMemberId");
};
