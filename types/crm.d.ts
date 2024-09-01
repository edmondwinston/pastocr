declare interface MeetupRecord {
  id: number;
  name: string;
  phone: string;
  industry: string;
  source: 'maps' | 'fb' | 'cty';
  location: string;
  time: string;
  situation: string;
  employee: string;
  type: 'tvm' | 'tvc';
}
