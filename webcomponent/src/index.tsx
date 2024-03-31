import r2wc from '@r2wc/react-to-web-component';
import { Chat } from './components/chat';

const wbChat = r2wc(Chat)
customElements.define("wb-chat", wbChat);