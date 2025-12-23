import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { LineIdTokenPayload } from './line.types'; 

@Injectable()
export class LineService {

  async verifyIdToken(idToken: string): Promise<LineIdTokenPayload> {
    try {
      const res = await axios.post(
        'https://api.line.me/oauth2/v2.1/verify',
        new URLSearchParams({
          id_token: idToken,
          client_id: process.env.LINE_CHANNEL_ID!,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

    
      return res.data as LineIdTokenPayload;
    } catch (err) {
      console.error(err); 
      throw new UnauthorizedException('Invalid LINE idToken');
    }
  }
}
