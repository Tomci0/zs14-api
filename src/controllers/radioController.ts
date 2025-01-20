import { Request, Response } from 'express';

import yts from 'yt-search';

import Verification, { IVerificationType } from '../models/verification.model';
import Song, { ISongType } from '../models/song.model';

import AppError from '../utils/appError';
import AppResponse from '../utils/appResponse';

import { IUser, ISong } from '../types/types';

import APIFeatures from '../utils/appFeatures';
import YTSearch from 'yt-search';

import axios from 'axios';
import { get } from 'http';

const api = axios.create({
    baseURL: 'http://localhost:42069',
});

interface IQueueApiResponse {
    id: string;
}

export default {
    index: (req: Request, res: Response) => {
        res.send('Radio Controller');
    },

    addSong: async (req: Request, res: Response) => {
        const { songId } = req.body;

        let currentSong;
        if (!songId) {
            return res.json(new AppError('Please provide a song ID', 400));
        }

        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var ytId = (songId.length == 11 && songId) || songId.match(regExp)[7];

        if (!ytId || ytId.length !== 11) {
            return res.json(new AppError('Invalid song ID', 400));
        }

        currentSong = await Song.findOne({ songId: songId });

        if (!currentSong) {
            try {
                const search = await YTSearch(songId);

                console.log(search);

                if (!search.videos.length) {
                    return res.json(new AppError('Song not found', 404));
                }

                const video = search.videos[0];

                const title = video.title;
                const channelName = video.author.name;

                const currentSong: ISongType = new Song({
                    songId: video.videoId,
                    title: title,
                    artist: channelName,
                    cover: video.image,
                    length: video.timestamp.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0),
                    addedBy: (req.user as IUser)._id,
                });

                await currentSong.save();

                try {
                    const user = req.user as IUser;

                    const newVerification = new Verification({
                        song: currentSong._id,
                        addedBy: user._id,
                    });

                    await newVerification.save();

                    return res.json(new AppResponse(200, 'Song added to verification queue', newVerification));
                } catch (err) {
                    return res.json(new AppError('Error adding song to verification queue', 500));
                }
            } catch (e) {
                console.log(e);
                return res.json(new AppError('Error adding song to database.', 500));
            }
        } else {
            const verification = await Verification.find({ song: currentSong._id });

            if (verification.length) {
                return res.json(new AppError('Song already in verification.', 400));
            }

            const queueStatus = await addSongToQueue(currentSong.songId);

            if (queueStatus) {
                return res.json(new AppResponse(200, 'Song added to queue', currentSong));
            } else {
                return res.json(new AppError('Error adding song to queue', 500));
            }
        }
    },

    getVerifications: async (req: Request, res: Response) => {
        const songsQuery = Verification.find().populate('addedBy').populate('song');
        const features = new APIFeatures(songsQuery, req.query).limitFields().sort().paginate();
        const songs = (await features.query).map((song) => {
            const userData: IUser = song.addedBy as IUser;

            return {
                _id: song._id,
                song: song.song as ISong,
                addedBy: {
                    _id: userData._id,
                    name: userData.name,
                    image: userData.image,
                },
                addedAt: song.addedAt,
            };
        });

        return res.json(new AppResponse(200, 'Songs fetched successfully', songs));
    },

    getQueue: async (req: Request, res: Response) => {
        const queue = await api.get('/queue');

        if (queue.status === 200) {
            const savedSongs = await Song.find();
            const queueData: IQueueApiResponse[] = queue.data;

            const songs = queueData.map((song) => {
                const savedSong = savedSongs.find((s) => s.songId === song.id);

                if (savedSong) {
                    return savedSong;
                } else {
                    return null;
                }
            });

            return res.json(new AppResponse(200, 'Queue fetched successfully', songs));
        } else {
            return res.json(new AppError('Error fetching queue', 500));
        }
    },

    accept: (req: Request, res: Response) => {
        // Accept song
    },

    decline: (req: Request, res: Response) => {},

    remove: (req: Request, res: Response) => {
        // Remove song
    },

    play: (req: Request, res: Response) => {
        // Play song
    },

    stop: (req: Request, res: Response) => {
        // Pause song
    },

    skip: (req: Request, res: Response) => {
        // Play next song
    },

    move: (req: Request, res: Response) => {
        // Move song in queue
    },
};

async function addSongToQueue(songId: string) {
    const response = await api.post('/queue', { id: songId });

    if (response.status === 201) {
        return true;
    } else {
        return false;
    }
}
