import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    try {
        const { folder } = await request.json();
        const timestamp = Math.floor(Date.now() / 1000);

        // Generate signature for image upload
        // Note: api_key is not included in signature calculation
        const params = {
            folder,
            timestamp
        };

        const signature = cloudinary.utils.api_sign_request(
            params,
            process.env.CLOUDINARY_API_SECRET
        );

        console.log(`Generated signature for folder: ${folder}, timestamp: ${timestamp}`);

        return NextResponse.json({
            signature,
            timestamp,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        });
    } catch (error) {
        console.error('Cloudinary signature error:', error);
        return NextResponse.json({ error: 'Unable to generate Cloudinary signature' }, { status: 500 });
    }
}
