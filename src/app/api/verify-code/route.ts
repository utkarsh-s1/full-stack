import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const us = await UserModel.findOne({
      username: username,
      isVerfified: false,
    });

    if (!us) {
      return Response.json(
        {
          success: false,
          message: "User already verified or username doesnot exist",
        },
        { status: 400 }
      );
    } else {
      console.log(us.verifyCodeID, code)
      if (
        us.verifyCodeID != code ||
        new Date(us.verifyCodeExpiry) < new Date()
      ) {
        return Response.json(
          {
            success: false,
            message: "Incorrect Code",
          },
          { status: 400 }
        );
      }
      us.isVerfified = true;
      await us.save();
      return Response.json(
        {
          success: true,
          message: "Account cerified",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: "errror while username validation",
      },
      {
        status: 500,
      }
    );
  }
}
