import type { NextApiRequest, NextApiResponse } from 'next'
import { Encrypt } from '../../utils/aes';

type EncryptData = {
    input: string;
    encrypted: string;
}

type ErrorData = {
    error: string;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<EncryptData | ErrorData>
) {
    if(req.method == "POST") {
    const input = req.body?.input;
    if(!input) return res.status(400).json({ error: "No input found" })
    const enc = Encrypt(input)
    res.status(200).json({ input: input, encrypted: enc })
    } else res.status(405).json({ error: "Method not allowed" })
}