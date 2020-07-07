package main

import (
	"backend/internal/api"

	"flag"
	"log"
	"os"
	"os/signal"
	"path"
	"sync"
)

func main() {
	directory := flag.String("d", ".", "base data directory")
	testMode := flag.Bool("t", false, "Test mode.")
	flag.Parse()

	var wg sync.WaitGroup
	stop := make(chan struct{})

	processes := []func(){
		func() {
			defer wg.Done()

			var store *api.Store

			if *testMode == true {
				log.Println("TEST MODE")
				store = api.NewTestStore(path.Join(*directory, "api"), stop)
			} else {
				store = api.NewProductionStore(path.Join(*directory, "api"), stop)
			}

			store.Serve(9400)
		},
	}

	wg.Add(len(processes))

	for _, process := range processes {
		go process()
	}

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	<-interrupt

	log.Println("Stopping system...")

	close(stop)

	wg.Wait()

	log.Println("Stopped.")
}
