import dbConnect from '@/lib/dbConnect';
import UserModel, { Message } from '@/model/User.model';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';


export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  const {content, id} = await request.json()

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = _user._id
  try {
    const user = await UserModel.findById(userId)
    const userToSend = await UserModel.findById(id)

    if (!user || !userToSend) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    if(!userToSend.isAcceptingMessage){
        return Response.json(
            { message: 'user not accepting messages', success: false },
            { status: 404 }
          );

    }
    userToSend.message.push({
        content:content,
        createdAt:new Date()
    } as Message)


    return Response.json(
      { 
        success:true,
        message:"mesage send succesfully"
       },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}