import type { NextApiRequest, NextApiResponse } from 'next'
import { Decrypt } from '../../utils/aes';

type DecryptData = {
    input: string;
    decrypted: string;
}

type ErrorData = {
    error: string;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<DecryptData | ErrorData>
) {
    if(req.method == "POST") {
    const input = JSON.parse(req.body)?.input;
    if(!input) return res.status(400).json({ error: "No input found" })
    const dec = Decrypt(input)
    res.status(200).json({ input: input, decrypted: dec })
    } else res.status(405).json({ error: "Method not allowed" })
}