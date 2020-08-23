import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/IMAY', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

export default mongoose;
