let localTracks = {
  videoTrack: null,
  audioTrack: null
};
let remoteUsers = {};

let APP_ID = '890df86203c0450188e8b357ed8b341d';
let token = '007eJxTYGDSv+OUH/1v9fYls5t+lPqEFoX+kug0uZT50G1yiLGfrKICg4WlQUqahZmRgXGygYmpgaGFRapFkrGpeWoKkDIxTPm4cFNmQyAjgwxnAgsjAwSC+CwMuYmZeQwMAAPXHeY=';
let uid = Math.floor(Math.random() * 10000);
let client;

let init = async () => {
  client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

  client.on('user-published', handleUserPublished);
  client.on('user-unpublished', handleUserUnpublished);

  await client.join(APP_ID, 'main', token, uid);

  localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
  localTracks.videoTrack.play('user1');

  await client.publish([localTracks.videoTrack]);
  console.log('Published local video track');
};

let handleUserPublished = async (user, mediaType) => {
  remoteUsers[user.uid] = user;
  await client.subscribe(user, mediaType);
  console.log('Subscribed to remote user:', user.uid);

  if (mediaType === 'video') {
    const remoteVideoTrack = user.videoTrack;
    remoteVideoTrack.play('user2');
  }
};

let handleUserUnpublished = (user) => {
  delete remoteUsers[user.uid];
  console.log('User unpublished:', user.uid);
};

let leaveChannel = async () => {
  if (localTracks.videoTrack) {
    localTracks.videoTrack.stop();
    localTracks.videoTrack.close();
  }
  
  await client.leave();
  console.log('Left channel');
};

init();

document.getElementById('create-offer').addEventListener('click', () => {
  console.log('Agora handles connections automatically');
});

document.getElementById('create-answer').addEventListener('click', () => {
  console.log('Agora handles connections automatically');
});

document.getElementById('add-answer').addEventListener('click', leaveChannel);
