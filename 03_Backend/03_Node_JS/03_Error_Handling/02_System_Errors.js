// node-error-codes-demo.js

console.log('🔍 Node.js System Error Codes Explained\n');

// ✅ EACCES - Permission denied
try {
  throw new Error('EACCES: permission denied, access /root/secret');
} catch (err) {
  console.error('EACCES:', err.message);
  // Explanation: You tried to access a file or resource without sufficient privileges.
}

// ✅ EADDRINUSE - Address already in use
try {
  throw new Error('EADDRINUSE: address already in use 127.0.0.1:3000');
} catch (err) {
  console.error('EADDRINUSE:', err.message);
  // Explanation: A server is already running on the specified port.
}

// ✅ ECONNRESET - Connection reset by peer
try {
  throw new Error('ECONNRESET: connection reset by peer');
} catch (err) {
  console.error('ECONNRESET:', err.message);
  // Explanation: The remote side closed the connection unexpectedly.
}

// ✅ EEXIST - File exists
try {
  throw new Error('EEXIST: file already exists');
} catch (err) {
  console.error('EEXIST:', err.message);
  // Explanation: You tried to create a file or directory that already exists.
}

// ✅ EISDIR - Is a directory
try {
  throw new Error('EISDIR: illegal operation on a directory');
} catch (err) {
  console.error('EISDIR:', err.message);
  // Explanation: You tried to read/write a directory as if it were a file.
}

// ✅ EMFILE - Too many open files in system
try {
  throw new Error('EMFILE: too many open files');
} catch (err) {
  console.error('EMFILE:', err.message);
  // Explanation: The system has reached its file descriptor limit.
}

// ✅ ENOENT - No such file or directory
try {
  throw new Error('ENOENT: no such file or directory');
} catch (err) {
  console.error('ENOENT:', err.message);
  // Explanation: You tried to access a file or path that doesn't exist.
}

// ✅ ENOTDIR - Not a directory
try {
  throw new Error('ENOTDIR: not a directory');
} catch (err) {
  console.error('ENOTDIR:', err.message);
  // Explanation: You tried to treat a file as a directory.
}

// ✅ ENOTEMPTY - Directory not empty
try {
  throw new Error('ENOTEMPTY: directory not empty');
} catch (err) {
  console.error('ENOTEMPTY:', err.message);
  // Explanation: You tried to delete a directory that still contains files.
}

// ✅ ENOTFOUND - DNS lookup failed
try {
  throw new Error('ENOTFOUND: DNS lookup failed');
} catch (err) {
  console.error('ENOTFOUND:', err.message);
  // Explanation: The hostname could not be resolved.
}

// ✅ EPERM - Operation not permitted
try {
  throw new Error('EPERM: operation not permitted');
} catch (err) {
  console.error('EPERM:', err.message);
  // Explanation: You tried to perform a restricted operation.
}

// ✅ EPIPE - Broken Pipe
try {
  throw new Error('EPIPE: broken pipe');
} catch (err) {
  console.error('EPIPE:', err.message);
  // Explanation: You tried to write to a stream that was already closed.
}

// ✅ ETIMEDOUT - Operation timed out
try {
  throw new Error('ETIMEDOUT: operation timed out');
} catch (err) {
  console.error('ETIMEDOUT:', err.message);
  // Explanation: A network or async operation took too long to complete.
}

console.log('\n✅ Error simulation complete. Each block shows how to recognize and interpret common Node.js errors.');
