import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return new NextResponse('Not allowed in production', { status: 403 });
    }

    const config = await request.json();
    const configPath = join(process.cwd(), 'config.json');

    await writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

    return new NextResponse('Configuration updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error updating configuration:', error);
    return new NextResponse('Error updating configuration', { status: 500 });
  }
} 