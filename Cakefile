fs            = require 'fs'
path          = require 'path'
{spawn, exec} = require 'child_process'
stdout        = process.stdout

titanium_version = "1.6.1"
titanium_path = "/Library/Application\ Support/Titanium/mobilesdk/osx/#{titanium_version}"

android_sdk   = process.env.ANDROID_SDK

# ANSI Terminal Colors.
bold   = "\033[0;1m"
red    = "\033[0;31m"
green  = "\033[0;32m"
yellow = "\033[0;33m"
blue   = "\033[0;34m"
reset  = "\033[0m"

# output titanium log
titanium_log = (data) ->
  data = data.toString().replace(/^\s*\n/g, '')
  lines = data.split(/\n/)
  for line in lines
    continue unless line.length > 0
    if line.match(/\[INFO\]/)
      stdout.write reset + green + line
    else if line.match(/\[TRACE\]/)
      stdout.write reset + blue + line
    else if line.match(/\[DEBUG\]/)
      stdout.write reset + blue + line
    else if line.match(/\[WARN\]/)
      stdout.write reset + yellow + line
    else if line.match(/\[ERROR\]/)
      stdout.write reset + red + line
    else
      stdout.write line
    stdout.write "\n"

  stdout.write reset

# Handle error and kill the process.
onerror = (err) ->
  if err
    process.stdout.write "#{red}#{err.stack}#{reset}\n"
    process.exit -1

task "watch", "Continously compile CoffeeScript to JavaScript", ->
  cmd = spawn("coffee", ["-cw", "-o", "Resources", "src"])
  cmd.stdout.on "data", (data) -> stdout.write green + data + reset
  cmd.on "error", onerror

task "run:iphone", "Test run application on iPhone simulator", ->
  cmd = spawn("#{titanium_path}/titanium.py", ["run", "--platform=iphone"])
  cmd.stdout.on "data", titanium_log
  cmd.stderr.on "data", onerror
  cmd.on "error", onerror

task "run:android", "Test run application on Android Emulator", ->
  cmd = spawn("#{titanium_path}/android/builder.py", ["run", ".", android_sdk])
  cmd.stdout.on "data", titanium_log
  cmd.stderr.on "data", onerror
  cmd.on "error", onerror

  emu = spawn("#{titanium_path}/android/builder.py", ["run-emulator", ".", android_sdk])
  emu.stderr.on "data", onerror
  emu.on "error", onerror
